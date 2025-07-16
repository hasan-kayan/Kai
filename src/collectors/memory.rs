use sysinfo::System;

#[derive(Debug)]
pub struct MemoryStats {
    pub total: u64,
    pub used: u64,
    pub free: u64,
    pub available: u64,
    pub swap_total: u64,
    pub swap_used: u64,
}

pub fn get_memory_stats() -> MemoryStats {
    let mut sys = System::new();
    sys.refresh_memory();

    MemoryStats {
        total: sys.total_memory(),
        used: sys.used_memory(),
        free: sys.free_memory(), // NOTE: sysinfo 0.30+ supports this
        available: sys.available_memory(),
        swap_total: sys.total_swap(),
        swap_used: sys.used_swap(),
    }
}
