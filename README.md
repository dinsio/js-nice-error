# JS-Nice-Error

### A friendly new javascript Error class which can trace the whole error path and info.

## **Install**

~~~
npm install js-nice-error --save
~~~

or

~~~
yarn add js-nice-error
~~~

## **API**

### Class NiceError

- Property
    - name - String - error name
    - message - String - error message
    - info - Object - context infomation about the error
    - stack - String - stack trace of the error
- Method
    - fullMessage() - String - get all the messages of the error chain path 
    - fullStack() - String - get all the stack infomations of the error chain path
    - fullInfo() - Object - merge all the info objects in this error chain into one big info object

## **Demo**

#### Handling inner error

~~~
// a normal js Error
let err = new Error('This is a normal error')

// a NiceError which takes err as it's inner error
let ne1 = new NiceError('A normal error was caught!',{
    name: 'NiceError',
    cause: err,
    info: {
        foo: 'foo'
    }
})

// another NiceError which takes ne1 as it's inner error
let ne2 = new NiceError('An inner NiceError was caught!',{
    name: 'AppError',
    cause: ne1,
    info: {
        bar: 'bar'
    }
})

console.log(ne2.message)
------------------------------
An inner NiceError was caught!

console.log(ne2.fullMessage())
------------------------------
[AppError]: An inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error

console.log(ne2.fullStack())
----------------------------
[AppError]: An inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error
        at Object.<anonymous>.test (/test/NiceError.test.js:18:15)
        at Object.asyncJestTest (/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
        at resolve (/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
        at new Promise (<anonymous>)
        at mapper (/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
        at promise.then (/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
        at process._tickCallback (internal/process/next_tick.js:68:7)
    Caused by [NiceError]: A normal error was caught! <= [Error]: This is a normal error
        at Object.<anonymous>.test (/test/NiceError.test.js:11:15)
        at Object.asyncJestTest (/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
        at resolve (/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
        at new Promise (<anonymous>)
        at mapper (/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
        at promise.then (/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
        at process._tickCallback (internal/process/next_tick.js:68:7)
    Caused by [Error]: This is a normal error
        at Object.<anonymous>.test (/test/NiceError.test.js:10:15)
        at Object.asyncJestTest (/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
        at resolve (/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
        at new Promise (<anonymous>)
        at mapper (/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
        at promise.then (/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
        at process._tickCallback (internal/process/next_tick.js:68:7)

console.log(ne2.fullInfo())
---------------------------
{
    foo: 'foo',
    bar: 'bar'
}
~~~

#### Handling unexpected thown object as inner error

~~~
let err = { foo: 'bar'}
try {
    // just throw an object
    throw err
}
catch(err) {
    // a NiceError which takes the thrown object as inner err
    let ne1 = new NiceError('An object was thrown',{
        name: 'NiceError',
        cause: err
    })

    console.log(ne1.fullMessage())
    ------------------------------
[NiceError]: An object was thrown <= [Throw]: type = [object Object], content = {"foo":"bar"}

    console.log(ne1.fullStack())
    ----------------------------
[NiceError]: An object was thrown <= [Throw]: type = [object Object], content = {"foo":"bar"}
    at Object.<anonymous>.test (/test/NiceError.test.js:38:19)
    at Object.asyncJestTest (/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
    at resolve (/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
    at new Promise (<anonymous>)
    at mapper (/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
    at promise.then (/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
    at process._tickCallback (internal/process/next_tick.js:68:7)
Caused by [Throw]: type = [object Object], content = {"foo":"bar"}
    at Object.fullStack (/test/NiceError.test.js:45:25)
    at Object.asyncJestTest (/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
    at resolve (/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
    at new Promise (<anonymous>)
    at mapper (/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
    at promise.then (/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
    at process._tickCallback (internal/process/next_tick.js:68:7)
}
~~~

## Enjoy it :-)