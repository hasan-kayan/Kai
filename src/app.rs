use crate::collectors::{self, DiskInfo};

#[derive(Default)]
pub struct App {
    pub disk: Vec<DiskInfo>,
}

impl App {
    pub fn on_tick(&mut self) {
        self.disk = collectors::list();
    }
    pub fn on_key(&mut self, key: crossterm::event::KeyEvent) -> bool {
        matches!(key.code, crossterm::event::KeyCode::Char('q'))
    }
}
