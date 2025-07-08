mod app;
mod collectors;
mod events;
mod ui;

use anyhow::Result;
use app::App;
use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use events::{Event, Events};
use ratatui::{backend::CrosstermBackend, prelude::*, Terminal};
use std::io::stdout;

fn main() -> Result<()> {
    /* Terminal kurulumu */
    enable_raw_mode()?;
    execute!(stdout(), EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout());
    let mut term = Terminal::new(backend)?;

    /* Uygulama durumu + event kaynağı */
    let mut app = App::default();
    let events = Events::new(std::time::Duration::from_millis(500));

    /* Döngü */
    loop {
        term.draw(|f| {
            let size = f.size();
            ui::disk::render(size, f, &app.disk);
        })?;

        match events.next() {
            Event::Tick => app.on_tick(),
            Event::Key(key) => {
                if app.on_key(key) {
                    break;
                }
            }
        }
    }

    /* Temiz çıkış */
    disable_raw_mode()?;
    execute!(term.backend_mut(), LeaveAlternateScreen)?;
    term.show_cursor()?;
    Ok(())
}
