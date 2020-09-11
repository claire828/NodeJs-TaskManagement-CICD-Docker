
declare interface Array<T> {
    exRemoveAt(index: number):T
    exToString():string
}

declare interface Date{
    exNow():number
}

declare interface String{
   exToObj():object
}

declare interface Number {
    exFloor():number
    exFloorTimeToSec():number
    exHoursInSec():number
}

