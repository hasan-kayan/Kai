# DOCS DATABASES

bash ```

databases/
├── Cargo.toml
├── src
│   ├── lib.rs          # Ortak API (başka crate’ler çağırabilir)
│   ├── config.rs       # Config struct’ı okur
│   ├── postgres.rs     # PostgreSQL işlemleri
│   └── main.rs         # `cargo run -p databases -- install` için CLI
└── databases.toml      # Hangi DB’lerin gerekli olduğunu tanımlar
```