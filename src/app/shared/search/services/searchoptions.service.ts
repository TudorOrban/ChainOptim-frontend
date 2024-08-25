import { Injectable } from "@angular/core";
import { Feature } from "../../enums/commonEnums";
import { OrderStatus } from "../../../dashboard/supply/models/SupplierOrder";
import { FilterType, SearchOptions } from "../models/searchTypes";

/**
 * Service for storing search options for different features.
 */
@Injectable({
    providedIn: 'root'
})
export class SearchOptionsService {

    private searchOptions: Map<Feature, SearchOptions>;

    constructor() {
        this.searchOptions = new Map<Feature, SearchOptions>([
            [Feature.SUPPLIER_ORDER, {
                filterOptions: [
                    {
                        key: {
                            label: "Order Date",
                            value: "orderDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Estimated Delivery Date",
                            value: "estimatedDeliveryDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Delivery Date",
                            value: "deliveryDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Quantity",
                            value: "Quantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                    {
                        key: {
                            label: "Delivered Quantity",
                            value: "DeliveredQuantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                    {
                        key: {
                            label: "Status",
                            value: "status",
                        },
                        valueOptions: [
                            {
                                label: "Delivered",
                                value: OrderStatus.DELIVERED
                            },
                            {
                                label: "Initiated",
                                value: OrderStatus.INITIATED
                            },
                            {
                                label: "Placed",
                                value: OrderStatus.PLACED
                            }
                        ],
                        filterType: FilterType.ENUM
                    },
                ],
                sortOptions: [
                    { label: 'Created At', value: 'createdAt' },
                    { label: 'Updated At', value: 'updatedAt' },
                    { label: 'Order Date', value: 'orderDate' },
                    { label: 'Delivery Date', value: 'deliveryDate' },
                    { label: 'Quantity', value: 'quantity' },
                ],
            }],
            [Feature.CLIENT_ORDER, {
                filterOptions: [
                    {
                        key: {
                            label: "Order Date",
                            value: "orderDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Estimated Delivery Date",
                            value: "estimatedDeliveryDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Delivery Date",
                            value: "deliveryDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Quantity",
                            value: "Quantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                    {
                        key: {
                            label: "Delivered Quantity",
                            value: "DeliveredQuantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                    {
                        key: {
                            label: "Status",
                            value: "status",
                        },
                        valueOptions: [
                            {
                                label: "Delivered",
                                value: OrderStatus.DELIVERED
                            },
                            {
                                label: "Initiated",
                                value: OrderStatus.INITIATED
                            },
                            {
                                label: "Placed",
                                value: OrderStatus.PLACED
                            }
                        ],
                        filterType: FilterType.ENUM
                    },
                ],
                sortOptions: [
                    { label: 'Created At', value: 'createdAt' },
                    { label: 'Updated At', value: 'updatedAt' },
                    { label: 'Order Date', value: 'orderDate' },
                    { label: 'Delivery Date', value: 'deliveryDate' },
                    { label: 'Quantity', value: 'quantity' },
                ],
            }],
            [Feature.SUPPLIER_SHIPMENT, {
                filterOptions: [
                    {
                        key: {
                            label: "Departure Date",
                            value: "departureDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Estimated Arrival Date",
                            value: "estimatedArrivalDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Arrival Date",
                            value: "arrivalDate",
                        },
                        valueOptions: [],
                        filterType: FilterType.DATE
                    },
                    {
                        key: {
                            label: "Quantity",
                            value: "Quantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                    {
                        key: {
                            label: "Status",
                            value: "status",
                        },
                        valueOptions: [
                            {
                                label: "Delivered",
                                value: OrderStatus.DELIVERED
                            },
                            {
                                label: "Initiated",
                                value: OrderStatus.INITIATED
                            },
                            {
                                label: "Placed",
                                value: OrderStatus.PLACED
                            }
                        ],
                        filterType: FilterType.ENUM
                    },
                ],
                sortOptions: [
                    { label: 'Created At', value: 'createdAt' },
                    { label: 'Updated At', value: 'updatedAt' },
                    { label: 'Departure Date', value: 'departureDate' },
                    { label: 'Arrival Date', value: 'deliveryDate' },
                    { label: 'Quantity', value: 'quantity' },
                ],
            }],
            [Feature.FACTORY_INVENTORY, {
                filterOptions: [
                    {
                        key: {
                            label: "Quantity",
                            value: "Quantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                    {
                        key: {
                            label: "Minimum Required Quantity",
                            value: "MinimumRequiredQuantity",
                        },
                        valueOptions: [],
                        filterType: FilterType.NUMBER
                    },
                ],
                sortOptions: [
                    { label: 'Created At', value: 'createdAt' },
                    { label: 'Updated At', value: 'updatedAt' },
                    { label: 'Order Date', value: 'orderDate' },
                    { label: 'Quantity', value: 'quantity' },
                ],
            }],
        ]);
    }

    getSearchOptions(key: Feature): SearchOptions | undefined {
        if (this.searchOptions.has(key)) {
            return this.searchOptions.get(key);
        }
        return undefined;
    }

}