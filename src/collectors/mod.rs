pub mod disk;
pub mod memory;
pub mod procfs;

pub use disk::{list, DiskInfo}; // ✅ Re-export `list`
pub use memory::{get_memory_stats, MemoryStats};
