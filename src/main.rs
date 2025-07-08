use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Style},
    widgets::{Block, Borders, Row, Table},
    Terminal,
};
mod collectors;
use collectors::list;

fn main() -> anyhow::Result<()> {
    enable_raw_mode()?;
    let mut stdout = std::io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut term = Terminal::new(backend)?;

    loop {
        let rows: Vec<Row> = list()
            .into_iter()
            .map(|d| {
                let pct = format!("{:.1}%", d.percent());
                let col = match d.percent() {
                    x if x < 50.0 => Color::Green,
                    x if x < 80.0 => Color::Yellow,
                    _ => Color::Red,
                };
                Row::new(vec![
                    d.mount_point.display().to_string(),
                    d.fs_type,
                    format!("{:.1}G", d.used as f64 / 1.074e9),
                    format!("{:.1}G", d.total as f64 / 1.074e9),
                    pct,
                ])
                .style(Style::default().fg(col))
            })
            .collect();

        term.draw(|f| {
            let size = f.size();
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([Constraint::Percentage(100)].as_ref())
                .split(size);

            let table = Table::new(rows)
                .header(
                    Row::new(["Mount", "FS", "Used", "Total", "%"]).style(
                        Style::default()
                            .fg(Color::Cyan)
                            .add_modifier(ratatui::style::Modifier::BOLD),
                    ),
                )
                .block(Block::default().title("Disk Usage").borders(Borders::ALL))
                .widths(&[
                    Constraint::Length(20),
                    Constraint::Length(6),
                    Constraint::Length(10),
                    Constraint::Length(10),
                    Constraint::Length(6),
                ]);
            f.render_widget(table, chunks[0]);
        })?;

        // Basit çıkış: `q` tuşu
        if crossterm::event::poll(std::time::Duration::from_millis(500))? {
            if let crossterm::event::Event::Key(k) = crossterm::event::read()? {
                if k.code == crossterm::event::KeyCode::Char('q') {
                    break;
                }
            }
        }
    }

    disable_raw_mode()?;
    execute!(term.backend_mut(), LeaveAlternateScreen)?;
    term.show_cursor()?;
    Ok(())
}
