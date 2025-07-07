pub async fn ensure_and_run(spec: &DBSpec, schema_js: &str) -> Result<()> {
    let client = mongodb::Client::with_uri_str(&spec.url()).await?;
    let db = client.database(&spec.name);

    // varsa sil/oluştur gibi ağır işlemlerden kaçın, sadece var mı kontrol:
    if db.list_collection_names(None).await?.is_empty() {
        // UI’dan “createCollection” veya “createIndex” JS script’i alıyoruz
        db.run_command(mongodb::bson::doc! { "eval": schema_js }, None).await?;
    }
    Ok(())
}
