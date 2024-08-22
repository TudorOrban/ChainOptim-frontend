import { Injectable } from "@angular/core";
import { Feature } from "../../enums/commonEnums";
import { FeatureConfiguration, FeatureInfo } from "../models/uiTypes";
import { InfoLevel } from "../../../dashboard/settings/models/UserSettings";


@Injectable({
    providedIn: 'root',
})
export class InfoService {

    private infoConfiguration: FeatureConfiguration = {
        [Feature.USER]: {
            tooltipText: "A User is any person that has access to the resources of the organization. " +
                "You can assign different roles to Users, each with different permissions and access levels.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.PRODUCT]: {
            tooltipText: "A Product is any item that is manufactured and/or sold by your organization.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.PRODUCT_STAGE]: {
            tooltipText: "A Product Stage is any step in the manufacturing process of a product. " +
                "You can define any number of Stage Inputs and Stage Outputs, consisting of " +
                "Components and how much of them are needed or produced in one full Stage. " +
                "You can also set up Connections between them, effectively configuring a 'Production Pipeline'.",
            infoLevel: InfoLevel.ADVANCED,
        },
        [Feature.COMPONENT]: {
            tooltipText: "A Component is any good that is used in the manufacturing process of a product.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.FACTORY]: {
            tooltipText: "A Factory is any organization site where manufacturing takes place.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.FACTORY_STAGE]: {
            tooltipText: "A Factory Stage is any manufacturing process taking place in a Factory. " +
                "You can define the underlying Product Stage, " +
                "the number of stages the Factory can execute (Capacity) in a given time period (Duration), " +
                "as well as priorities for allocation of resources. " +
                "You can also set up Connections between them, determining a continuous flow of production.",
            infoLevel: InfoLevel.ADVANCED,
        },
        [Feature.RESOURCE_ALLOCATION_PLAN]: {
            tooltipText: "A Resource Allocation Plan is a plan that determines how resources are allocated to Factory Stages. " +
                "You can compute an Allocation Plan over a time period, based on the current Factory Inventory levels, " +
                "activate it, as well as seek resources for existing deficits.",
            infoLevel: InfoLevel.ADVANCED,
        },
        [Feature.FACTORY_INVENTORY_ITEM]: {
            tooltipText: "A Factory Inventory is a record of all the Products and Components currently stored within a Factory.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.FACTORY_PRODUCTION_HISTORY]: {
            tooltipText: "A Factory Production History is a record of all the Factory Stages executed by a Factory over time. " +
                "You can add records over any given time period, along with the planned allocations during that time. " +
                "The more records you add, the better the system can analyze your production performance and provide insights into optimizing it.",
            infoLevel: InfoLevel.ADVANCED,
        },
        [Feature.FACTORY_PERFORMANCE]: {
            tooltipText: "A Factory Performance Report is a detailed analysis of the Production Performance of a Factory over time. " +
                "It measures the efficiency of resource distribution, readiness and utilization, as well as several other key performance indicators. " +
                "You can refresh the report at any time with the most up-to-date Factory Production History.",
            infoLevel: InfoLevel.ADVANCED,
        },
        [Feature.WAREHOUSE]: {
            tooltipText: "A Warehouse is any organization site where storage and distribution of goods takes place.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.WAREHOUSE_INVENTORY_ITEM]: {
            tooltipText: "A Warehouse Inventory is a record of all the Products and Components currently stored within a Warehouse.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.SUPPLIER]: {
            tooltipText: "A Supplier is any organization that provides goods to your organization.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.SUPPLIER_ORDER]: {
            tooltipText: "A Supplier Order is a request for goods from a Supplier. " +
                "You can create an Order for any Supplier, specifying the Product or Component you need, as well as the quantities. " +
                "You can also set up a Delivery Date and a Delivery Location.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.SUPPLIER_SHIPMENT]: {
            tooltipText: "A Supplier Shipment is any delivery of goods from a Supplier to your organization. " +
                "You can create a Shipment for any Supplier Order, specifying the quantities delivered, as well as the actual Delivery Date.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.SUPPLIER_PERFORMANCE]: {
            tooltipText: "A Supplier Performance Report is a detailed analysis of the Performance of a Supplier over time. " +
                "It measures the reliability of deliveries, the quality of goods, as well as several other key performance indicators. " +
                "You can refresh the report at any time with the most up-to-date Supplier Orders.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.CLIENT]: {
            tooltipText: "A Client is any organization that receives goods from your organization.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.CLIENT_ORDER]: {
            tooltipText: "A Client Order is a request for goods from a Client. " +
                "You can create an Order for any Client, specifying the Product you need, as well as the quantities. " +
                "You can also set up a Delivery Date and a Delivery Location.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.CLIENT_SHIPMENT]: {
            tooltipText: "A Client Shipment is any delivery of goods from your organization to a Client. " +
                "You can create a Shipment for any Client Order, specifying the quantities delivered, as well as the actual Delivery Date.",
            infoLevel: InfoLevel.ALL,
        },
        [Feature.CLIENT_EVALUATION]: {
            tooltipText: "A Client Evaluation Report is a detailed analysis of the Client over time. " +
                "It measures the demand, reliability, as well as several other key performance indicators. " +
                "You can refresh the report at any time with the most up-to-date Client Orders.",
            infoLevel: InfoLevel.ALL,
        },
    }

    getFeatureInfo(feature: Feature): FeatureInfo {
        return this.infoConfiguration[feature];
    }
}