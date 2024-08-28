import { StandardUnit, UnitMagnitude } from "../../../shared/enums/unitEnums";

export interface UnitOfMeasurement {
    standardUnit: StandardUnit;
    unitMagnitude: UnitMagnitude;
}

// function completeUnit(unit: UnitOfMeasurement): void {
//     const standardUnit = StandardUnit.fromName(unit.standardUnit);
//     const unitMagnitude = UnitMagnitude.fromName(unit.unitMagnitude);

//     if (standardUnit && unitMagnitude) {
//         console.log(`Standard Unit: ${standardUnit.name}, Abbreviation: ${standardUnit.abbreviation}, Category: ${standardUnit.category}`);
//         console.log(`Unit Magnitude: ${unitMagnitude.name}, Abbreviation: ${unitMagnitude.abbreviation}, Magnitude: ${unitMagnitude.magnitude}`);
//     } else {
//         console.error("Invalid unit names received");
//     }
// }