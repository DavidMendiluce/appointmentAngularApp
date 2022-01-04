export interface Appointment {
    _id: string,
    guests: string,
    price: number,
    reservationNumber: number
    locationId: number
    address: string,
    fromDate: string | null,
    toDate: string | null,
    days: number,
    propertyType: string,
    clientName: string,
    clientSurname: string,
    clientEmail: string,
    clientPhone: number,
    arrivalTime: string,
    taxi: string,
    carRental: string
}
