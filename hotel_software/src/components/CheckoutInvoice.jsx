import { useRef } from "react";
import { FaPrint } from "react-icons/fa";

const CheckoutInvoice = ({ checkoutData, hotelInfo, variant = "guest" }) => {
  const invoiceRef = useRef(null);

  if (!checkoutData) return null;

  const {
    guestName,
    designation,
    roomNumber,
    roomVariantName,
    checkInDate,
    checkInTime,
    actualCheckoutDate,
    checkOutDate,
    actualNights,
    numberOfGuests,
    contactNumber,
    pricePerNight,
    actualRoomCharge,
    restaurantOrders = [],
    laundryOrders = [],
    transportOrders = [],
    totalCharges,
    advancePayment = 0,
    finalAmount,
    isRefund,
    _id,
  } = checkoutData;

  const advance = Number(advancePayment) || 0;
  const final = Number(finalAmount) || 0;
  const isHotelCopy = variant === "hotel";

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";
    if (num < 0) return `Minus ${numberToWords(Math.abs(num))}`;
    if (num < 20) return ones[num];
    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? ` ${ones[num % 10]}` : "")
      );
    }
    if (num < 1000) {
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? ` ${numberToWords(num % 100)}` : "")
      );
    }
    if (num < 100000) {
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? ` ${numberToWords(num % 1000)}` : "")
      );
    }
    if (num < 10000000) {
      return (
        numberToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? ` ${numberToWords(num % 100000)}` : "")
      );
    }
    return num.toString();
  };

  const amountInWords = `${numberToWords(Math.round(final))} Taka Only`;

  const handlePrint = () => {
    const selectedInvoice = invoiceRef.current;
    if (!selectedInvoice) return;

    // Print only the invoice whose button was clicked.
    document.body.classList.add("printing-checkout-invoice");
    document
      .querySelectorAll(".invoice-page.print-selected")
      .forEach((invoice) => invoice.classList.remove("print-selected"));
    selectedInvoice.classList.add("print-selected");

    const cleanup = () => {
      document.body.classList.remove("printing-checkout-invoice");
      selectedInvoice.classList.remove("print-selected");
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.print();

    // Fallback cleanup for browsers that don't fire afterprint.
    window.setTimeout(cleanup, 1000);
  };

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div
      ref={invoiceRef}
      className="invoice-page bg-white"
      data-invoice-variant={variant}
    >
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body.printing-checkout-invoice .invoice-page {
            display: none !important;
          }

          body.printing-checkout-invoice .invoice-page.print-selected {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
          }

          .invoice-container {
            width: 100% !important;
            max-width: 100% !important;
            height: 287mm !important;
            min-height: 287mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            border: 0 !important;
            padding: 0 2mm !important;
            zoom: 1;
            overflow: visible !important;
          }

          .invoice-body {
            flex: 1 0 auto !important;
            width: 100% !important;
            min-width: 0 !important;
          }

          .invoice-container table {
            width: 100% !important;
            table-layout: fixed !important;
          }

          .invoice-container th,
          .invoice-container td {
            overflow-wrap: anywhere !important;
            word-break: normal !important;
          }

          .invoice-container .flex.justify-end > div {
            max-width: 100% !important;
          }

          .invoice-footer {
            width: 100% !important;
            margin-top: auto !important;
            padding-top: 8px !important;
            page-break-inside: avoid;
            text-align: center !important;
          }

          .invoice-container .invoice-body > p,
          .invoice-container .invoice-footer > p,
          .invoice-container .invoice-footer > div:last-child {
            text-align: center !important;
          }

          .invoice-container .mb-4 { margin-bottom: 6px !important; }
          .invoice-container .mb-3 { margin-bottom: 5px !important; }
          .invoice-container .mt-8 { margin-top: 10px !important; }
          .invoice-container .mb-6 { margin-bottom: 8px !important; }
          .invoice-container th,
          .invoice-container td { padding: 2px 4px !important; }
          .invoice-container table { font-size: 9px !important; }
          .invoice-container .signature-area { margin-top: 10px !important; margin-bottom: 8px !important; }
          .invoice-container .invoice-footer > p { margin-bottom: 5px !important; }
          .invoice-container .invoice-footer > div:last-child { margin-top: 6px !important; padding-top: 4px !important; }

          .print\\:hidden {
            display: none !important;
          }

          .invoice-page,
          .invoice-container,
          .invoice-body,
          .invoice-footer {
            break-inside: auto;
          }

          .invoice-footer,
          .signature-area,
          .paid-stamp {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Only this invoice is printed when its button is clicked. */}
      <div className="mb-3 flex justify-end print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-sm gap-2 border-none bg-rose-900 text-white hover:bg-rose-800"
        >
          <FaPrint />
          Print {isHotelCopy ? "Hotel Invoice" : "Guest Invoice"}
        </button>
      </div>

      <div className="invoice-container mx-auto max-w-4xl border border-gray-400 p-4 text-xs leading-tight text-gray-800 sm:p-5">
        <div className="invoice-body">
          {/* Hotel Header */}
          <div className="mb-3 text-center">
            <h1 className="text-xl font-bold tracking-wide text-rose-700 sm:text-2xl">
              {hotelInfo?.hotelName || "YOUR HOTEL NAME"}
            </h1>

            {hotelInfo?.address && (
              <p className="mt-0.5 text-[11px] font-medium text-gray-700">
                {hotelInfo.address}
              </p>
            )}

            <p className="mt-0.5 text-[10px] italic text-gray-500">
              {hotelInfo?.tagline || "A luxury hotel of your comfort"}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-600">
              {hotelInfo?.email && `E-mail: ${hotelInfo.email}`}
              {hotelInfo?.website && ` | ${hotelInfo.website}`}
              {hotelInfo?.phone && ` | ${hotelInfo.phone}`}
            </p>
          </div>

          {/* Both versions use the same invoice title; no "Hotel Copy" label. */}
          <h2 className="mb-4 text-center text-sm font-bold tracking-wider underline">
            GUEST INVOICE
          </h2>

          {/* Guest Information */}
          <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-0.5 text-xs sm:grid-cols-2">
            <div className="space-y-0.5">
              <p>
                <span className="inline-block w-28 font-semibold">
                  Guest's Name
                </span>
                : <strong>{guestName?.toUpperCase() || "—"}</strong>
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">Company</span>
                : {designation || "—"}
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">Arrival</span>
                : {checkInDate} {checkInTime || ""}
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">
                  Departure
                </span>
                : {actualCheckoutDate || checkOutDate || "—"}
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">
                  No. of Night
                </span>
                : {actualNights ?? "—"}
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">
                  No. of Person
                </span>
                : {numberOfGuests || 1}
              </p>
            </div>

            <div className="space-y-0.5">
              <p>
                <span className="inline-block w-32 font-semibold">
                  Registration No.
                </span>
                : {_id?.toString().slice(-8).toUpperCase() || "—"}
              </p>
              <p>
                <span className="inline-block w-32 font-semibold">
                  Room No.
                </span>
                : {roomNumber || "—"}
              </p>
              <p>
                <span className="inline-block w-32 font-semibold">
                  Room Type
                </span>
                : {roomVariantName || "—"}
              </p>
              <p>
                <span className="inline-block w-32 font-semibold">
                  Rack Rate (BDT)
                </span>
                : {formatMoney(pricePerNight)}
              </p>
              <p>
                <span className="inline-block w-32 font-semibold">
                  Room Rent (BDT)
                </span>
                : {formatMoney(actualRoomCharge)}
              </p>
              <p>
                <span className="inline-block w-32 font-semibold">Contact</span>
                : {contactNumber || "—"}
              </p>
            </div>
          </div>

          {/* Charges Table */}
          <div className="mb-3 overflow-x-auto">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-1.5 py-1 text-left">
                    Date
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-left">
                    Ref No.
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-left">
                    Item Description
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    Charge
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    Service
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    VAT
                  </th>
                  <th className="border border-gray-400 px-1.5 py-1 text-right">
                    Gross
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 px-1.5 py-1">
                    {checkInDate}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1">
                    {roomNumber}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1">
                    Room Rent ({actualNights} Night{actualNights > 1 ? "s" : ""}
                    )
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    {formatMoney(actualRoomCharge)}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    {formatMoney(actualRoomCharge)}
                  </td>
                </tr>

                {restaurantOrders.map((order, idx) =>
                  (order.foodItems || []).map((item, itemIdx) => (
                    <tr key={`rest-${idx}-${itemIdx}`}>
                      <td className="border border-gray-400 px-1.5 py-1">
                        {order.orderDate || actualCheckoutDate || checkOutDate}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        RST-{idx + 1}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        Restaurant: {item.itemName} × {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                    </tr>
                  )),
                )}

                {laundryOrders.map((order, idx) =>
                  (order.clothItems || []).map((item, itemIdx) => (
                    <tr key={`lnd-${idx}-${itemIdx}`}>
                      <td className="border border-gray-400 px-1.5 py-1">
                        {order.orderDate || actualCheckoutDate || checkOutDate}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        LND-{idx + 1}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1">
                        Laundry ({order.laundryType}): {item.clothName} ×{" "}
                        {item.quantity}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        0.00
                      </td>
                      <td className="border border-gray-400 px-1.5 py-1 text-right">
                        {formatMoney(item.totalPrice)}
                      </td>
                    </tr>
                  )),
                )}

                {transportOrders.map((order, idx) => (
                  <tr key={`trn-${idx}`}>
                    <td className="border border-gray-400 px-1.5 py-1">
                      {order.pickupDate || actualCheckoutDate || checkOutDate}
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1">
                      TRN-{idx + 1}
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1">
                      Transport: {order.vehicleType} ({order.pickupLocation} →{" "}
                      {order.destination})
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      {formatMoney(order.fare)}
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      0.00
                    </td>
                    <td className="border border-gray-400 px-1.5 py-1 text-right">
                      {formatMoney(order.fare)}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className="border border-gray-400 px-1.5 py-1">
                    {actualCheckoutDate || checkOutDate}
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1">—</td>
                  <td className="border border-gray-400 px-1.5 py-1">
                    Payment / Advance Received
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right text-green-700">
                    ({formatMoney(advance)})
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right">
                    0.00
                  </td>
                  <td className="border border-gray-400 px-1.5 py-1 text-right text-green-700">
                    ({formatMoney(advance)})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mb-3 flex justify-end">
            <div className="w-60 space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount : Tk.</span>
                <span>{formatMoney(totalCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Adjustment : Tk.</span>
                <span>0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Bill : Tk.</span>
                <span>{formatMoney(totalCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Payment Receive : Tk.</span>
                <span>{formatMoney(advance)}</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-gray-400 pt-1 font-bold">
                <span>{isRefund ? "Guest Refund" : "Balance"} : Tk.</span>
                <span>{formatMoney(final)}</span>
              </div>
            </div>
          </div>

          <p className="mb-3 text-xs">
            <strong>Taka In Word :</strong> {amountInWords}
          </p>

          {final === 0 && (
            <div className="paid-stamp my-3 text-center">
              <span className="-rotate-6 inline-block border-4 border-blue-600 px-6 py-0.5 text-2xl font-bold tracking-widest text-blue-600">
                PAID
              </span>
            </div>
          )}
        </div>

        {/* Footer and signatures are kept together at the bottom of the invoice. */}
        <div className="invoice-footer">
          <div className="signature-area mb-6 mt-8 flex justify-between text-xs">
            <div className="w-36 text-center">
              <div className="border-t border-gray-700 pt-1">
                Authorized Signature
              </div>
            </div>
            <div className="w-36 text-center">
              <div className="border-t border-gray-700 pt-1">
                Guest Signature
              </div>
            </div>
          </div>

          <p className="mb-2 text-center text-sm font-semibold">
            Thank You For Staying With Us
          </p>

          <p className="mb-3 text-center text-[10px] leading-snug text-gray-600">
            I agree that my liability for this bill is not waived and agree to
            be held personally liable in the event that the indicated person,
            company or govt. fails to pay for any part of the full amount to
            these charges.
          </p>

          <div className="mt-4 border-t border-gray-300 pt-2 text-center text-[10px] text-gray-500">
            Generated on {new Date().toLocaleString()} | Designed &amp;
            Developed by SmithIT
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInvoice;
