use crate::collectors::{self, DiskInfo};
use crossterm::event::{KeyCode, KeyEvent};

/// Tüm UI-durumu tek yerde:
#[derive(Default, Debug)]
pub struct AppState {
    /// Son güncellenen disk listesi
    pub disks: Vec<DiskInfo>,

    /// ‘d’ tuşuyla aç/kapat → disk grafiği modalı
    pub show_disk_modal: bool,
}

impl AppState {
    /// Periyodik olarak tetiklenir
    pub fn refresh(&mut self) {
        self.disks = collectors::list();
    }

    /// Bir tuşa basıldığında çağrılır  
    /// - `true` dönerse ana döngü sonlanır
    pub fn handle_key(&mut self, key: KeyEvent) -> bool {
        match key.code {
            KeyCode::Char('q') => return true, // çıkış
            KeyCode::Char('d') => self.show_disk_modal = !self.show_disk_modal,
            _ => {}
        }
        false
    }
}
