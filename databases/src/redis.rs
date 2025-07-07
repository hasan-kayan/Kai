pub async fn ensure_namespace(spec: &DBSpec) -> Result<()> {
    let client = redis::Client::open(spec.url())?;
    let mut conn = client.get_tokio_connection().await?;
    // Varsayılan DB numarasına `SELECT` et, ardından test anahtarını SET et
    let _: () = redis::cmd("PING").query_async(&mut conn).await?;
    Ok(())
}
