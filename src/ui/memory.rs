use crate::collectors::MemoryStats;
use ratatui::{
    backend::Backend,
    layout::{Constraint, Layout},
    prelude::Rect,
    style::{Modifier, Style},
    widgets::{Block, Borders, Cell, Row, Table},
    Frame,
};

/// Clean memory usage modal
pub fn render(area: Rect, f: &mut Frame, memory: &MemoryStats, _active: bool) {
    let rows = vec![
        make_row("Total", memory.total),
        make_row("Used", memory.used),
        make_row("Free", memory.free),
        make_row("Available", memory.available),
        make_row("Swap Total", memory.swap_total),
        make_row("Swap Used", memory.swap_used),
    ];

    let table = Table::new(rows)
        .header(
            Row::new(vec![
                Cell::from("     Metric"),    // <- padded header
                Cell::from("   Memory (MB)"), // <- padded header
            ])
            .style(Style::default().add_modifier(Modifier::BOLD)),
        )
        .block(Block::default().title("Memory Usage").borders(Borders::ALL))
        .widths(&[Constraint::Length(20), Constraint::Length(16)])
        .column_spacing(1);

    let layout = Layout::default()
        .constraints([Constraint::Percentage(100)])
        .split(area);

    f.render_widget(table, layout[0]);
}

fn make_row(label: &str, value_kb: u64) -> Row {
    Row::new(vec![
        Cell::from(format!("{:<15}", label)), // left-aligned label, padded
        Cell::from(format!("{:>12.2}", value_kb as f64 / 1024.0)), // right-aligned number, padded
    ])
}
