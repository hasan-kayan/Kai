use crossterm::event::{self, Event as CEvent, KeyEvent};
use std::{
    sync::mpsc,
    thread,
    time::{Duration, Instant},
};

/// UI döngüsünün anlayacağı olaylar
pub enum Event {
    Tick,
    Key(KeyEvent),
}

pub struct Events {
    rx: mpsc::Receiver<Event>,
}

impl Events {
    pub fn new(tick_rate: Duration) -> Self {
        let (tx, rx) = mpsc::channel();
        // input
        thread::spawn({
            let tx = tx.clone();
            move || loop {
                if let CEvent::Key(k) = event::read().unwrap() {
                    tx.send(Event::Key(k)).ok();
                }
            }
        });
        // tick
        thread::spawn(move || {
            let mut last = Instant::now();
            loop {
                if last.elapsed() >= tick_rate {
                    tx.send(Event::Tick).ok();
                    last = Instant::now();
                }
                thread::sleep(Duration::from_millis(10));
            }
        });
        Self { rx }
    }
    pub fn next(&self) -> Event {
        self.rx.recv().unwrap()
    }
}
