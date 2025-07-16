#[derive(Clone, Debug)]
pub enum Command {
    ToggleDiskModal,
    ToggleMemoryModal,
    ShowTopMemoryProcesses, // 👈 new command
}

impl Command {
    pub fn parse(raw: &str) -> Option<Self> {
        match raw.trim() {
            "disk" | "d" => Some(Command::ToggleDiskModal),
            "memory" | "mem" | "m" => Some(Command::ToggleMemoryModal),
            "topmem" | "tm" => Some(Command::ShowTopMemoryProcesses),
            _ => None,
        }
    }

    pub fn execute(self, app: &mut crate::AppState) {
        match self {
            Command::ToggleDiskModal => app.show_disk_modal = !app.show_disk_modal,
            Command::ToggleMemoryModal => app.show_memory_modal = !app.show_memory_modal,
            Command::ShowTopMemoryProcesses => {
                crate::collectors::procfs::print_top_memory_processes(); // 👈 just prints to terminal
            }
        }
    }
}
