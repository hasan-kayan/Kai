// Tek collector var; gelecekte diğerlerini ekleyebilirsiniz
pub mod disk;

// Re-export: diğer dosyalarda `collectors::list()` diye çağırabiliriz
pub use disk::*;
