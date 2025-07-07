pub async fn ensure_db(pool_url: &str, dbname: &str, owner: &str) -> Result<()> {
    let pool = PgPoolOptions::new().max_connections(2).connect(pool_url).await?;
    let exists: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM pg_database WHERE datname = $1"
    ).bind(dbname).fetch_one(&pool).await?;
    if exists.0 == 0 {
        let q = format!(r#"CREATE DATABASE "{}" OWNER "{}""#, dbname, owner);
        pool.execute(&*q).await?;
    }
    Ok(())
}

pub async fn run_schema(pool_url: &str, schema_sql: &str) -> Result<()> {
    let pool = PgPoolOptions::new().max_connections(4).connect(pool_url).await?;
    for stmt in schema_sql.split(';').filter(|s| !s.trim().is_empty()) {
        pool.execute(stmt).await?;
    }
    Ok(())
}
