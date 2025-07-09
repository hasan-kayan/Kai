mod app; // AppState
mod collectors; // DiskInfo & list()
mod events; // Tick + Key abstraction
mod ui; // ui::disk::render()

use anyhow::Result;
use app::AppState;
use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use events::{Event, Events};
use ratatui::{backend::CrosstermBackend, prelude::*, Terminal};
use std::{io::stdout, time::Duration};

fn main() -> Result<()> {
    /* ────────── Terminal başlangıç ────────── */
    enable_raw_mode()?;
    execute!(stdout(), EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout());
    let mut term = Terminal::new(backend)?;

    /* ────────── Uygulama + event kaynağı ────────── */
    let mut app = AppState::default();
    let events = Events::new(Duration::from_millis(500));

    /* ────────── Döngü ────────── */
    loop {
        term.draw(|f| {
            let area = f.size();
            ui::disk::render(area, f, &app.disks, app.show_disk_modal);
        })?;

        match events.next() {
            Event::Tick => app.refresh(),
            Event::Key(key) if app.handle_key(key) => break,
            _ => {}
        }
    }

    /* ────────── Temiz çıkış ────────── */
    disable_raw_mode()?;
    execute!(term.backend_mut(), LeaveAlternateScreen)?;
    term.show_cursor()?;
    Ok(())
}
