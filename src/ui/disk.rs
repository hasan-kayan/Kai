//! Yalnızca disklere ait çizim

use crate::collectors::DiskInfo;
use ratatui::{
    prelude::*,
    widgets::{Block, Borders, Cell, Row, Table}, // <-- BURAYA Cell EKLENDİ
};

pub fn render(area: Rect, frame: &mut Frame, data: &[DiskInfo]) {
    let header = Row::new(["Mount", "FS", "Used", "Total", "%"].map(Cell::from)).style(
        Style::default()
            .fg(Color::Cyan)
            .add_modifier(Modifier::BOLD),
    );

    let rows = data.iter().map(|d| {
        let pct = d.percent();
        let col = if pct < 50.0 {
            Color::Green
        } else if pct < 80.0 {
            Color::Yellow
        } else {
            Color::Red
        };

        Row::new([
            d.mount_point.display().to_string(),
            d.fs_type.clone(),
            format!("{:.1}G", d.used as f64 / 1.074e9),
            format!("{:.1}G", d.total as f64 / 1.074e9),
            format!("{pct:.1}%"),
        ])
        .style(Style::default().fg(col))
    });

    let table = Table::new(rows)
        .header(header)
        .block(Block::default().title("Disk Usage").borders(Borders::ALL))
        .widths(&[
            Constraint::Length(22),
            Constraint::Length(6),
            Constraint::Length(10),
            Constraint::Length(10),
            Constraint::Length(6),
        ]);

    frame.render_widget(table, area);
}
