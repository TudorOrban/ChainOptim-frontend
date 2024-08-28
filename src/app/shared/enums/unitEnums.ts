export class StandardUnit {
    constructor(
        public name: string,
        public abbreviation: string,
        public category: string
    ) {}

    toString(): string {
        return this.name.charAt(0) + this.name.slice(1).toLowerCase();
    }
    
    static fromName(name: string): StandardUnit | undefined {
        return Units[name.toUpperCase() as StandardUnitKey];
    }
}

export const Units = {
    METER: new StandardUnit("Meter", "m", "Length"),
    INCH: new StandardUnit("Inch", "in", "Length"),
    KILOGRAM: new StandardUnit("Kilogram", "g", "Mass"),
    POUND: new StandardUnit("Pound", "lb", "Mass"),
    LITER: new StandardUnit("Liter", "l", "Volume")
};

export class UnitMagnitude {
    constructor(
        public name: string,
        public abbreviation: string,
        public magnitude: number
    ) {}

    toString(): string {
        return this.name.charAt(0) + this.name.slice(1).toLowerCase();
    }
    
    static fromName(name: string): UnitMagnitude | undefined {
        return Magnitudes[name.toUpperCase() as UnitMagnitudeKey];
    }
}

export const Magnitudes = {
    MILLI: new UnitMagnitude("Milli", "m", 0.001),
    CENTI: new UnitMagnitude("Centi", "c", 0.01),
    DECI: new UnitMagnitude("Deci", "d", 0.1),
    BASE: new UnitMagnitude("Base", "", 1),
    DECA: new UnitMagnitude("Deca", "da", 10),
    HECTO: new UnitMagnitude("Hecto", "h", 100),
    KILO: new UnitMagnitude("Kilo", "k", 1000)
};

type StandardUnitKey = 'METER' | 'INCH' | 'KILOGRAM' | 'POUND' | 'LITER';
type UnitMagnitudeKey = 'MILLI' | 'CENTI' | 'DECI' | 'BASE' | 'DECA' | 'HECTO' | 'KILO';