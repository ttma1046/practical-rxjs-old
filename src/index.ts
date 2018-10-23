import {
    Observable,
    Observer,
    fromEvent,
    from,
    timer,
    interval,
    of,
    zip,
    forkJoin,
    throwError,
    Subject
} from 'rxjs';

import {
    map,
    filter,
    switchMap,
    mergeMap,
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
    multicast
} from 'rxjs/operators';

function print(val: string) {
    let el = document.createElement('p');
    el.innerText = val;
    document.body.appendChild(el);
}


const observable = Observable.create((observer: Observer<string>) => {
    observer.next('hello');
    observer.next('world');
    observer.next('Test');
    observer.complete();
})

observable.subscribe((val: string) => print(val));

const clicks = fromEvent(document, 'click');

clicks.subscribe(click => console.log(click));

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('resolved!')
    }, 2000)
});

const obsvPromise = from(promise);

obsvPromise.subscribe((result: string) => print(result));

const alarmclock = timer(1000);

alarmclock.subscribe(done => print('ding!!!'));

const myinterval = interval(1000);

myinterval.subscribe(int => print((new Date().getSeconds()).toString()));

const mashup = of('anything', ['you', 'want'], 23, true, { cool: 'stuff' });

mashup.subscribe(mashup => print(JSON.stringify(mashup)));

const cold = Observable.create((observer: Observer<number>) => {
    observer.next(Math.random())
})

cold.subscribe((a: number) => print(`Subscriber A: ${a}`))
cold.subscribe((b: number) => print(`Subscriber B: ${b}`))

const x = Math.random();
const hot = Observable.create((observer: Observer<number>) => {
    observer.next(x);
})

hot.subscribe((a: number) => print(`Subscriber A: ${a}`))
hot.subscribe((b: number) => print(`Subscriber B: ${b}`))


const cold2 = Observable.create((observer: Observer<number>) => {
    observer.next(Math.random())
})

const hot2 = cold2.pipe(publish());

hot2.subscribe((a: number) => print(`Subscriber A: ${a}`))
hot2.subscribe((b: number) => print(`Subscriber B: ${b}`))

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
    .subscribe(x => print(x.toString()));

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
    filter(n => n >= 0)).subscribe(n => print(n.toString()));

numbersv2.pipe(first()).subscribe(n => print(n.toString()));

numbersv2.pipe(last()).subscribe(n => print(n.toString()));

let mouseEvents = fromEvent(document, 'mousemove');

mouseEvents.pipe(throttleTime(1000))
    .subscribe(e => print(e.type));

mouseEvents.pipe(debounceTime(1000))
    .subscribe(e => print(e.type));

let gameClicks = fromEvent(document, 'click');

gameClicks.pipe(
    map(e => parseInt((Math.random() * 10).toString(), 10)),
    tap(score => print(`Click scored + ${score}`)),
    scan((highScore, score) => highScore + score))
    .subscribe(highScore => print(`High Score ${highScore}`));


let intervalClicks = fromEvent(document, 'click');

intervalClicks.pipe(
    switchMap(click => {
        return interval(500)
    })).subscribe(i => print(i.toString()));

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

combo.subscribe(arr => print(arr.toString()));

const yinv2 = of('peanut butter', 'wine', 'rainbows');
const yangv2 = of('jelly', 'cheese', 'unicorns').pipe(delay(2000));

const combov2 = forkJoin(yin, yang);

combov2.subscribe(arr => print(arr.toString()));

const throwErrorObservable = throwError('catch me!');
throwErrorObservable.pipe(
    catchError(err => of(`Error caught: ${err}`)),
    retry(2))
    .subscribe((val: string) => print(val), e => print(e));

const subject = new Subject();
const subA = subject.subscribe(val => print(`Sub A: ${val}`));
const subB = subject.subscribe(val => print(`Sub B: ${val}`));

subject.next('Hello');

setTimeout(() => {
    subject.next('World');
}, 1000);

const observableforMulticast = fromEvent(document, 'click');

const multiCastClicks: any = observableforMulticast.pipe(
    tap(_ => print('Do One Time!')),
    multicast(() => new Subject())
);

const subAformulti = multiCastClicks.subscribe((c: any) => print(`Sub A: ${c.timeStamp}`));
const subBformulti = multiCastClicks.subscribe((c: any) => print(`Sub B: ${c.timeStamp}`));

multiCastClicks.connect();

const input1 = document.querySelector('#input1');
const input2 = document.querySelector('#input2');

const span = document.querySelector('span');

const obsInput1 = fromEvent(input1, 'input');
const obsInput2 = fromEvent(input2, 'input');

obsInput1.pipe(
    mergeMap(
        event1 => obsInput2.pipe(
            map(event2 => (<HTMLInputElement>event1.target).value + ' ' + (<HTMLInputElement>event2.target).value)
        )
    )
).subscribe(
    combinedValue => { span.textContent = combinedValue; console.log('test'); }
);


const numbersMerge1 = of(1, 2, 3);

const numbersMerge2 = of(5, 10, 15);

numbersMerge1.pipe(
    mergeMap(
        number1 => numbersMerge2.pipe(
            map(number2 => number1 * number2)
        )
    )
).subscribe(
    combined => print(combined.toString())
);

