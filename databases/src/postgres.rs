use anyhow::Result;
use async_trait::async_trait;
use sqlx::{
    postgres::PgPoolOptions,
    Executor,
};

use crate::{
    config::DBSpec,
    engine::DatabaseEngine,
};

pub struct PostgresEngine;

impl PostgresEngine {
    /// Admin (superuser) connection string.  
    /// Falls back to a sensible default if POSTGRES_ADMIN_URL env var yok.
    fn admin_url(spec: &DBSpec) -> String {
        std::env::var("POSTGRES_ADMIN_URL").unwrap_or_else(|_| {
            format!(
                "postgres://{user}:{password}@{host}:{port}/postgres",
                user = spec.user,
                password = spec.password,
                host = spec.host.as_deref().unwrap_or("localhost"),
                port = spec.port.unwrap_or(5432)
            )
        })
    }

    /// Normal connection string pointing to the target DB.
    fn db_url(spec: &DBSpec) -> String {
        format!(
            "postgres://{user}:{password}@{host}:{port}/{db}",
            user = spec.user,
            password = spec.password,
            host = spec.host.as_deref().unwrap_or("localhost"),
            port = spec.port.unwrap_or(5432),
            db   = spec.name
        )
    }
}

#[async_trait]
impl DatabaseEngine for PostgresEngine {
    async fn ensure(&self, spec: &DBSpec) -> Result<()> {
        let admin_url = Self::admin_url(spec);

        let pool = PgPoolOptions::new()
            .max_connections(2)
            .connect(&admin_url)
            .await?;

        // DB var mı?
        let exists: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM pg_database WHERE datname = $1",
        )
        .bind(&spec.name)
        .fetch_one(&pool)
        .await?;

        if exists.0 == 0 {
            let create_db = format!(
                r#"CREATE DATABASE "{}" OWNER "{}""#,
                spec.name, spec.user
            );
            pool.execute(create_db.as_str()).await?;
            println!("✅ PostgreSQL database created: {}", spec.name);
        } else {
            println!("ℹ️  PostgreSQL database already exists: {}", spec.name);
        }

        Ok(())
    }

    async fn run_schema(&self, spec: &DBSpec, schema_sql: &str) -> Result<()> {
        let db_url = Self::db_url(spec);

        let pool = PgPoolOptions::new()
            .max_connections(4)
            .connect(&db_url)
            .await?;

        // Çok basit ayırma—production’da sqlx::migrate tercih edin
        for stmt in schema_sql
            .split(';')
            .filter(|s| !s.trim().is_empty())
        {
            pool.execute(stmt).await?;
        }

        println!("✅ Schema applied to {}", spec.name);
        Ok(())
    }
}
