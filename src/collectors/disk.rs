//! Disk toplayıcı – sysinfo 0.35 API

use std::path::{Path, PathBuf};
use sysinfo::{Disk, Disks};

/// Tek bağlama noktasını temsil eden veri yapısı
#[derive(Debug, Clone)]
pub struct DiskInfo {
    pub mount_point: PathBuf,
    pub fs_type: String,
    pub total: u64,
    pub used: u64,
    pub free: u64,
}

impl DiskInfo {
    /// Kullanım yüzdesi
    pub fn percent(&self) -> f32 {
        if self.total == 0 {
            0.0
        } else {
            self.used as f32 / self.total as f32 * 100.0
        }
    }
}

/// Sistemdeki tüm diskleri döndür.
pub fn list() -> Vec<DiskInfo> {
    // Disks::new_with_refreshed_list()  --> mount listesini anında doldurur :contentReference[oaicite:0]{index=0}
    let disks = Disks::new_with_refreshed_list();
    disks.list().iter().map(to_info).collect()
}

/// Mount noktasıyla arama
pub fn find<P: AsRef<Path>>(mount: P) -> Option<DiskInfo> {
    list().into_iter().find(|d| d.mount_point == mount.as_ref())
}

/* --------- Yardımcı --------- */

fn to_info(disk: &Disk) -> DiskInfo {
    let total = disk.total_space();
    let free = disk.available_space();
    DiskInfo {
        mount_point: disk.mount_point().to_path_buf(),
        fs_type: disk.file_system().to_string_lossy().into(),
        total,
        used: total - free,
        free,
    }
}
