use sysinfo::{RefreshKind, System};

pub fn print_top_memory_processes() {
    let mut sys = System::new();
    sys.refresh_specifics(RefreshKind::everything());

    let mut processes: Vec<_> = sys.processes().values().collect();
    processes.sort_by_key(|p| -(p.memory() as i64));

    println!("\n{:<8} │ {:<25} │ {:>12}", "PID", "Process", "Memory (MB)");
    println!("{}", "─".repeat(52));

    for proc in processes.iter().take(10) {
        println!(
            "{:<8} │ {:<25} │ {:>12.2}",
            proc.pid(),
            truncate(&proc.name().to_string_lossy(), 25),
            proc.memory() as f64 / 1024.0
        );
    }

    println!(); // extra spacing after table
}

fn truncate(name: &str, max: usize) -> String {
    if name.chars().count() > max {
        let mut short = name.chars().take(max - 3).collect::<String>();
        short.push_str("...");
        short
    } else {
        format!("{name}")
    }
}
