#[async_trait::async_trait]
pub trait DatabaseEngine {
    /// Bağlan ve (yoksa) veritabanını/collection’ı oluştur.
    async fn ensure(&self, spec: &DBSpec) -> anyhow::Result<()>;

    /// Gönderilen kod bloğunu spesifik motorda çalıştır.
    async fn run_schema(&self, spec: &DBSpec, schema_sql: &str) -> anyhow::Result<()>;
}
