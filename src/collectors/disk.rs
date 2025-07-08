//! Disk collector — yalnızca sysinfo kullanır

use std::path::{Path, PathBuf};
use sysinfo::{Disk, Disks};

/// Taşınabilir disk bilgisi
#[derive(Debug, Clone)]
pub struct DiskInfo {
    pub mount_point: PathBuf,
    pub fs_type: String,
    pub total: u64,
    pub used: u64,
    pub free: u64,
}

impl DiskInfo {
    pub fn percent(&self) -> f32 {
        if self.total == 0 {
            0.0
        } else {
            self.used as f32 / self.total as f32 * 100.0
        }
    }
}

/// Tüm diskleri oku
pub fn list() -> Vec<DiskInfo> {
    Disks::new_with_refreshed_list()
        .list()
        .iter()
        .map(to_info)
        .collect()
}

/// Mount noktasına göre ara
pub fn find<P: AsRef<Path>>(mount: P) -> Option<DiskInfo> {
    list().into_iter().find(|d| d.mount_point == mount.as_ref())
}

/* --- İç yardımcı --- */

fn to_info(d: &Disk) -> DiskInfo {
    let total = d.total_space();
    let free = d.available_space();
    DiskInfo {
        mount_point: d.mount_point().to_path_buf(),
        fs_type: d.file_system().to_string_lossy().into(),
        total,
        used: total - free,
        free,
    }
}
