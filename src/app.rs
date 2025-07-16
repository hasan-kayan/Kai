use crate::collectors::{self, DiskInfo, MemoryStats};
use crossterm::event::{KeyCode, KeyEvent};

#[derive(Debug)]
pub struct AppState {
    pub disks: Vec<DiskInfo>,
    pub memory: MemoryStats,
    pub show_disk_modal: bool,
    pub show_memory_modal: bool,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            disks: collectors::list(),              // ✅ FIXED
            memory: collectors::get_memory_stats(), // ✅ FIXED
            show_disk_modal: false,
            show_memory_modal: false,
        }
    }
}

impl AppState {
    pub fn refresh(&mut self) {
        self.disks = collectors::list(); // ✅ FIXED
        self.memory = collectors::get_memory_stats();
    }

    pub fn handle_key(&mut self, key: KeyEvent) -> bool {
        match key.code {
            KeyCode::Char('q') => return true,
            KeyCode::Char('d') => {
                self.show_disk_modal = !self.show_disk_modal;
                self.show_memory_modal = false;
            }
            KeyCode::Char('m') => {
                self.show_memory_modal = !self.show_memory_modal;
                self.show_disk_modal = false;
            }
            KeyCode::Char('t') => {
                crate::collectors::procfs::print_top_memory_processes(); // prints to stdout
            }

            _ => {}
        }
        false
    }
}
