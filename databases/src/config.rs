use serde::Deserialize;
use std::{fs, path::Path};

#[derive(Debug, Deserialize)]
pub struct DatabaseSpec {
    pub name: String,
    pub engine: String, // "postgres" | "mysql" | "sqlite" ...
    pub user: String,
    pub password: String,
    #[serde(default)]
    pub host: Option<String>, // localhost:5432 varsayılır
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub databases: Vec<DatabaseSpec>,
}

impl Config {
    pub fn load(path: &Path) -> anyhow::Result<Self> {
        let content = fs::read_to_string(path)?;
        Ok(toml::from_str::<Config>(&content)?)
    }
}
