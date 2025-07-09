use crate::collectors::DiskInfo;
use ratatui::{
    layout::{Constraint, Direction, Layout},
    prelude::*,
    widgets::{BarChart, Block, Borders, Cell, Clear, Row, Table},
};

/// Ana tablo + (varsa) modal çizen tek giriş fonksiyonu
pub fn render(area: Rect, frame: &mut Frame, data: &[DiskInfo], show_modal: bool) {
    render_table(area, frame, data);

    if show_modal {
        let modal_area = centered_rect(60, 50, frame.size());
        render_modal(modal_area, frame, data);
    }
}

/* ------------------------------------------------------------------------- */
/*                              TABLO                                        */
/* ------------------------------------------------------------------------- */

fn render_table(area: Rect, frame: &mut Frame, data: &[DiskInfo]) {
    let header = Row::new(["Mount", "FS", "Used", "Total", "%"].map(Cell::from)).style(
        Style::default()
            .fg(Color::Cyan)
            .add_modifier(Modifier::BOLD),
    );

    let rows = data.iter().map(|d| {
        let pct = d.percent();
        let col = match pct {
            p if p < 50.0 => Color::Green,
            p if p < 80.0 => Color::Yellow,
            _ => Color::Red,
        };

        Row::new([
            d.mount_point.display().to_string(),
            d.fs_type.clone(),
            format!("{:.1} G", d.used as f64 / 1.074e9),
            format!("{:.1} G", d.total as f64 / 1.074e9),
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

/* ------------------------------------------------------------------------- */
/*                              MODAL                                        */
/* ------------------------------------------------------------------------- */

fn render_modal(area: Rect, frame: &mut Frame, data: &[DiskInfo]) {
    // Arka planı temizle
    frame.render_widget(Clear, area);

    // BarChart verisi (% değerini 0-100 arası tam sayı yapıyoruz)
    let chart_data: Vec<(&str, u64)> = data
        .iter()
        .map(|d| {
            let label = d
                .mount_point
                .file_name()
                .and_then(|s| s.to_str())
                .unwrap_or(d.mount_point.to_str().unwrap_or("/"));
            (label, d.percent().round() as u64)
        })
        .collect();

    let chart = BarChart::default()
        .block(
            Block::default()
                .title("Disk Doluluk (%)")
                .borders(Borders::ALL),
        )
        .data(&chart_data)
        .bar_width(8)
        .bar_gap(1)
        .max(100) // ölçek sabit: 0-100
        .label_style(Style::default().fg(Color::Cyan))
        .value_style(
            Style::default()
                .fg(Color::White)
                .add_modifier(Modifier::BOLD),
        );

    frame.render_widget(chart, area);
}

/* ------------------------------------------------------------------------- */
/*                        Yardımcı: modal merkezleme                         */
/* ------------------------------------------------------------------------- */

fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    let vert = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage((100 - percent_y) / 2),
            Constraint::Percentage(percent_y),
            Constraint::Percentage((100 - percent_y) / 2),
        ])
        .split(r);

    Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage((100 - percent_x) / 2),
            Constraint::Percentage(percent_x),
            Constraint::Percentage((100 - percent_x) / 2),
        ])
        .split(vert[1])[1]
}
