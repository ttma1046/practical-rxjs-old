function print(val) {
    let el = document.createElement('p');
    el.innerText = val;
    document.body.appendChild(el);
}

// const { Observable, Observer, interval, fromEvent, Subject, ReplaySubject, from, of , range, throwError } = rxjs;
// const { map, filter, switchMap, tap, scan, catchError } = rxjs.operators;

import { 
    Observable,
    fromEvent,
    from, 
    timer, 
    interval, 
    of, 
    zip, 
    forkJoin, 
    throwError, 
    Subject } from 'rxjs';
    
import { 
    map, 
    filter, 
    switchMap,
    fromPromise, 
    publish, 
    finalize, 
    tap, 
    first, 
    last, 
    throttleTime, 
    debounceTime, 
    scan, 
    takeUntil, 
    takeWhile,
    catchError,
    delay,
    retry,
    multicast } from 'rxjs/operators';

const observable = Observable.create((observer) => {
    observer.next('hello');
    observer.next('world');
    observer.next('Test');
})

observable.subscribe((val) => print(val));

const clicks = fromEvent(document, 'click');

clicks.subscribe(click => console.log(click));

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('resolved!')
    }, 2000)
});

const obsvPromise = from(promise);

obsvPromise.subscribe(result => print(result));

const alarmclock = timer(1000);

alarmclock.subscribe(done => print('ding!!!'));

// const myinterval = interval(1000);

// myinterval.subscribe(int => print(new Date().getSeconds()));

const mashup = of ('anything', ['you', 'want'], 23, true, { cool: 'stuff' });

mashup.subscribe(mashup => print(JSON.stringify(mashup)));

const cold = Observable.create(observer => {
    observer.next(Math.random())
})

cold.subscribe(a => print(`Subscriber A: ${a}`))
cold.subscribe(b => print(`Subscriber B: ${b}`))

const x = Math.random();
const hot = Observable.create(observer => {
    observer.next(x);
})

hot.subscribe(a => print(`Subscriber A: ${a}`))
hot.subscribe(b => print(`Subscriber B: ${b}`))


const cold2 = Observable.create(observer => {
    observer.next(Math.random())
})

const hot2 = cold2.pipe(publish());

hot2.subscribe(a => print(`Subscriber A: ${a}`))
hot2.subscribe(b => print(`Subscriber B: ${b}`))

hot2.connect();

const finalizeTimer = timer(1000);
finalizeTimer.pipe(finalize(() => print('All done!'))).subscribe();


const finalizeInterval = interval(500).pipe(finalize(() => print('All done!')));

const subscription = finalizeInterval.subscribe(x => print('finalizeInterval:' + x));

setTimeout(() => {
    subscription.unsubscribe()
}, 3000);

const numbers = of(10, 100, 1000);

numbers.pipe(
    map(num => Math.log(num)))
    .subscribe(x => print(x));

const jsonString = '{ "type": "Dog", "breed": "Pug" }';
const apiCall = of(jsonString);

apiCall.pipe(map(json => JSON.parse(json)))
.subscribe(obj => {
    print(obj.type);
    print(obj.breed);
})

const names = of('Simon', 'Garfunkle');

names
    .pipe(
        tap(name => print(name)), 
        map(name => name.toUpperCase()),
        tap(name => print(name)))
    .subscribe();

const numbersv2 = of(-3, 5, 7, 2, -7, 9, -2);

numbersv2.pipe(
    filter(n => n >= 0)).subscribe(n => print(n));

numbersv2.pipe(first()).subscribe(n => print(n));

numbersv2.pipe(last()).subscribe(n => print(n));

let mouseEvents = fromEvent(document, 'mousemove');

mouseEvents.pipe(throttleTime(1000))
    .subscribe(e => print(e.type));

mouseEvents.pipe(debounceTime(1000))
    .subscribe(e => print(e.type));

let gameClicks = fromEvent(document, 'click');

gameClicks.pipe(
    map(e => parseInt(Math.random() * 10)),
    tap(score => print(`Click scored + ${score}`)),
    scan((highScore, score) => highScore + score))
.subscribe(highScore => print(`High Score ${highScore}`));


let intervalClicks = fromEvent(document, 'click');

clicks.pipe(
    switchMap(click => {
        return interval(500)
    })).subscribe(i => print(i));

const intervaltick = interval(500);
const notifier = timer(2000);

intervaltick.pipe(takeUntil(notifier));


const namestakewhile = of('Bob', 'Jeff', 'Doug', 'Steve');

namestakewhile.pipe(
    takeWhile(name => name != 'Doug'),
    finalize(() => print('Complete! I found Doug')))
    .subscribe(i => print(i));

const yin = of('peanut butter', 'wine', 'rainbows');
const yang = of('jelly', 'cheese', 'unicorns');

const combo = zip(yin, yang);

combo.subscribe(arr => print(arr));

const yinv2 = of('peanut butter', 'wine', 'rainbows');
const yangv2 = of('jelly', 'cheese', 'unicorns').pipe(delay(2000));

const combov2 = forkJoin(yin, yang);

combov2.subscribe(arr => print(arr));

const throwErrorObservable = throwError('catch me!');
throwErrorObservable.pipe(
    catchError(err => print(`Error caught: ${err}`)),
    retry(2))
.subscribe(val => print(val), e => print(e));

const subject = new Subject();
const subA = subject.subscribe(val => print(`Sub A: ${val}`));
const subB = subject.subscribe(val => print(`Sub B: ${val}`));

subject.next('Hello');

setTimeout(() => {
    subject.next('World');
}, 1000);

const observableforMulticast = fromEvent(document, 'click');

const clicks = observableforMulticast.pipe(
    tap(_ => print('Do One Time!')),
    multicast(() => new Subject())
);

const subAformulti = clicks.subscribe(c => print(`Sub A: ${c.timeStamp}`));
const subBformulti = clicks.subscribe(c => print(`Sub B: ${c.timeStamp}`));

clicks.connect();