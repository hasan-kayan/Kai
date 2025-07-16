mod app;
mod collectors;
mod events;
mod ui;

use anyhow::Result;
use app::AppState;
use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use events::{Event, Events};
use ratatui::{
    backend::CrosstermBackend,
    widgets::{Block, Borders},
    Terminal,
};
use std::{io::stdout, time::Duration};

fn main() -> Result<()> {
    enable_raw_mode()?;
    execute!(stdout(), EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout());
    let mut term = Terminal::new(backend)?;

    let mut app = AppState::default();
    let events = Events::new(Duration::from_millis(500));

    loop {
        // inside term.draw
        term.draw(|f| {
            let area = f.size();

            if app.show_disk_modal {
                ui::disk::render(area, f, &app.disks, true);
            } else if app.show_memory_modal {
                ui::memory::render(area, f, &app.memory, true); // ✅ Works now
            } else {
                let block = Block::default()
                    .title("Kai CLI Monitor")
                    .borders(Borders::ALL);
                f.render_widget(block, area);
            }
        })?;

        match events.next() {
            Event::Tick => app.refresh(),
            Event::Key(key) if app.handle_key(key) => break,
            _ => {}
        }
    }

    disable_raw_mode()?;
    execute!(term.backend_mut(), LeaveAlternateScreen)?;
    term.show_cursor()?;
    Ok(())
}
