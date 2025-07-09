use std::{
    fs, io,
    path::{Path, PathBuf},
    time::SystemTime,
};

use sysinfo::{Disk, DiskKind, Disks};

/// Tek bir diskin temel bilgileri
#[derive(Debug, Clone)]
pub struct DiskInfo {
    pub mount_point: PathBuf,
    pub fs_type: String,
    pub kind: DiskCategory,
    pub total: u64,
    pub used: u64,
    pub free: u64,
}

impl DiskInfo {
    /// Doluluk yüzdesi (0–100)
    pub fn percent(&self) -> f32 {
        if self.total == 0 {
            0.0
        } else {
            self.used as f32 / self.total as f32 * 100.0
        }
    }
}

/// Fiziksel mi sanal mı?
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DiskCategory {
    Physical,
    Virtual,
    Unknown,
}

/// Tüm disklerin toplu özeti
#[derive(Debug)]
pub struct DisksSummary {
    pub generated_at: SystemTime,
    pub physical_count: usize,
    pub virtual_count: usize,
    pub total_space: u64,
    pub total_free: u64,
    pub disks: Vec<DiskInfo>,
}

/* ------------------------------------------------------------------------- */
/*                           KAMU API – YÜZÜ                                 */
/* ------------------------------------------------------------------------- */

/// Tüm diskleri oku
pub fn list() -> Vec<DiskInfo> {
    Disks::new_with_refreshed_list()
        .list()
        .iter()
        .map(to_info)
        .collect()
}

/// Belirli bir mount noktasını bul
pub fn find<P: AsRef<Path>>(mount: P) -> Option<DiskInfo> {
    list().into_iter().find(|d| d.mount_point == mount.as_ref())
}

/// Özet istatistikleri üret
pub fn summary() -> DisksSummary {
    let disks = list();
    let physical_count = disks
        .iter()
        .filter(|d| d.kind == DiskCategory::Physical)
        .count();
    let virtual_count = disks
        .iter()
        .filter(|d| d.kind == DiskCategory::Virtual)
        .count();
    let total_space = disks.iter().map(|d| d.total).sum();
    let total_free = disks.iter().map(|d| d.free).sum();

    DisksSummary {
        generated_at: SystemTime::now(),
        physical_count,
        virtual_count,
        total_space,
        total_free,
        disks,
    }
}

/// Bir mount noktasındaki en büyük *N* dosya/dizin (özyinelemeli)
///
/// > **Uyarı:** Büyük disklerde yavaş olabilir; asenkron, paralel
///   tarama veya boyut önbellekleme düşünülebilir.
pub fn top_entries<P: AsRef<Path>>(mount: P, n: usize) -> io::Result<Vec<EntryInfo>> {
    let mut entries = Vec::new();
    collect_sizes(mount.as_ref(), &mut entries)?;
    // Büyükten küçüğe sırala, ilk n elemanı al
    entries.sort_by_key(|e| std::cmp::Reverse(e.size));
    Ok(entries.into_iter().take(n).collect())
}

/// {path, size} çifti
#[derive(Debug)]
pub struct EntryInfo {
    pub path: PathBuf,
    pub size: u64,
}

/* ------------------------------------------------------------------------- */
/*                        İÇ YARDIMCI FONKSİYONLAR                           */
/* ------------------------------------------------------------------------- */

fn to_info(d: &Disk) -> DiskInfo {
    let total = d.total_space();
    let free = d.available_space();
    DiskInfo {
        mount_point: d.mount_point().to_path_buf(),
        fs_type: d.file_system().to_string_lossy().into_owned(),
        kind: classify(d),
        total,
        used: total - free,
        free,
    }
}

/// Fiziksel / sanal ayrımı
fn classify(d: &Disk) -> DiskCategory {
    match d.kind() {
        DiskKind::HDD | DiskKind::SSD => DiskCategory::Physical,
        _ => {
            let name = d.name().to_string_lossy();
            if name.starts_with("loop") || name.starts_with("zram") || name.ends_with("tmpfs") {
                DiskCategory::Virtual
            } else {
                DiskCategory::Unknown
            }
        }
    }
}

/// (Özyinelemeli) dosya/dizin boyutlarını topla
fn collect_sizes(dir: &Path, acc: &mut Vec<EntryInfo>) -> io::Result<u64> {
    let metadata = fs::symlink_metadata(dir)?;
    if metadata.is_file() {
        let size = metadata.len();
        acc.push(EntryInfo {
            path: dir.to_path_buf(),
            size,
        });
        Ok(size)
    } else if metadata.is_dir() {
        let mut total = 0;
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            total += collect_sizes(&entry.path(), acc)?;
        }
        acc.push(EntryInfo {
            path: dir.to_path_buf(),
            size: total,
        });
        Ok(total)
    } else {
        // symlink veya özel dosya ⇒ 0 B say
        Ok(0)
    }
}
