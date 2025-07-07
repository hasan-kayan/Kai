use anyhow::Result;
use clap::{Parser, Subcommand};
use std::path::PathBuf;
use tokio::fs;

use databases::{
    config::DBSpec,
    engine::EngineKind,
    install_from_file,
};

#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    /// Bulk-install config file (TOML). Defaults to databases/databases.toml
    #[arg(short, long)]
    config: Option<PathBuf>,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Read the TOML file and create any missing databases
    Install,
    /// Create a single database/collection and (optionally) apply a schema script
    Create {
        #[arg(long)] engine: String,              // postgres | mssql | mongodb | redis
        #[arg(long)] name: String,
        #[arg(long)] user: String,
        #[arg(long)] password: String,
        #[arg(long, default_value = "localhost")] host: String,
        #[arg(long, default_value_t = 5432)]      port: u16,
        /// Path to schema file (SQL / JS). If omitted no schema is executed.
        #[arg(long)] schema: Option<PathBuf>,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().ok();
    let cli = Cli::parse();

    match cli.command {
        Commands::Install => {
            let cfg_path = cli
                .config
                .unwrap_or_else(|| "databases/databases.toml".into());
            install_from_file(&cfg_path).await?;
        }

        Commands::Create {
            engine,
            name,
            user,
            password,
            host,
            port,
            schema,
        } => {
            // Build a minimal DBSpec from CLI args
            let spec = DBSpec {
                engine: engine.clone(),
                name,
                user,
                password,
                host: Some(host),
                port: Some(port),
                ..Default::default()
            };

            let kind = EngineKind::from(engine.as_str());
            kind.ensure(&spec).await?;

            if let Some(schema_path) = schema {
                let script = fs::read_to_string(schema_path).await?;
                kind.run_schema(&spec, &script).await?;
            }
        }
    }

    Ok(())
}
