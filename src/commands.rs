//! Uygulama içi komutlar

#[derive(Clone, Debug)]
pub enum Command {
    /// Disk penceresini aç / kapat
    ToggleDiskModal,
    // İleride eklenecek diğer komutlar …
}

impl Command {
    /// Basit string-to-command ayrıştırıcı
    pub fn parse(raw: &str) -> Option<Self> {
        match raw.trim() {
            "disk" | "d" => Some(Command::ToggleDiskModal),
            _ => None,
        }
    }

    /// Komutu uygula
    pub fn execute(self, app: &mut crate::AppState) {
        match self {
            Command::ToggleDiskModal => app.show_disk_modal = !app.show_disk_modal,
        }
    }
}
