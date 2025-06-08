'use client'
import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { WalletData } from '../Wallet'
import { DownloadCloud } from 'lucide-react'

interface InvoiceGeneratorProps {
    walletData: WalletData
    user: any
    formattedDate: string
}

const InvoiceGenerator = ({ walletData, user, formattedDate }: InvoiceGeneratorProps) => {
    const generateInvoice = () => {
        // Create a new PDF document
        const doc = new jsPDF()

        // Set document properties
        doc.setProperties({
            title: 'VeloRide Wallet Statement',
            subject: 'Wallet Statement',
            author: 'VeloRide',
            creator: 'VeloRide App'
        })

        // Add logo and header
        doc.setFontSize(22)
        doc.setTextColor(0, 86, 60) // #00563c color
        doc.text('VeloRide', 105, 20, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Wallet Statement', 105, 30, { align: 'center' })

        // Add divider
        doc.setDrawColor(0, 86, 60) // #00563c color
        doc.setLineWidth(0.5)
        doc.line(14, 35, 196, 35)

        // Add user information
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text(`User: ${user?.fullname || 'N/A'}`, 14, 45)
        doc.text(`Date: ${formattedDate}`, 14, 52)
        doc.text(`Account ID: ${user?._id?.slice(-8) || 'N/A'}`, 14, 59)

        // Add wallet summary
        doc.setFontSize(16)
        doc.setTextColor(0, 86, 60) // #00563c color
        doc.text('Wallet Summary', 14, 70)

        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)

        // Create wallet summary table
        autoTable(doc, {
            startY: 75,
            head: [['Description', 'Amount (PKR)']],
            body: [
                ['Current Balance', walletData.balance.currentBalance.toString()],
                ['Total Spent', walletData.totalSpent.toString()],
                ['Total Earned', walletData.totalEarned.toString()]
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 86, 60], textColor: [255, 255, 255] },
            styles: { halign: 'left' },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 60, halign: 'right' }
            }
        })

        // Add monthly stats
        doc.setFontSize(16)
        doc.setTextColor(0, 86, 60)
        doc.text('Monthly Statistics', 14, 125)

        // Monthly spending and earnings
        const lastMonthSpent = walletData.monthlySpent[walletData.monthlySpent.length - 1]
        const lastMonthEarned = walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1]

        // Create monthly stats table
        autoTable(doc, {
            startY: 130,
            head: [['Description', 'Amount (PKR)', 'Change']],
            body: [
                [
                    'Monthly Spent',
                    lastMonthSpent?.spent.toString() || '0',
                    `${lastMonthSpent?.percentageChange >= 0 ? '+' : ''}${Math.round(lastMonthSpent?.percentageChange || 0)}%`
                ],
                [
                    'Monthly Earned',
                    lastMonthEarned?.earned.toString() || '0',
                    `${lastMonthEarned?.percentageChange >= 0 ? '+' : ''}${Math.round(lastMonthEarned?.percentageChange || 0)}%`
                ]
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 86, 60], textColor: [255, 255, 255] },
            styles: { halign: 'left' },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 60, halign: 'right' },
                2: { cellWidth: 40, halign: 'center' }
            }
        })

        // Add spending breakdown
        doc.setFontSize(16)
        doc.setTextColor(0, 86, 60)
        doc.text('Spending Breakdown', 14, 165)

        // Create spending breakdown table if available
        if (walletData.spendings) {
            const spendingData = Object.entries(walletData.spendings).map(([category, amount]) => [
                category.charAt(0).toUpperCase() + category.slice(1),
                (amount as number).toString()
            ])

            autoTable(doc, {
                startY: 170,
                head: [['Category', 'Amount (PKR)']],
                body: spendingData.length > 0 ? spendingData : [['No spending data available', '']],
                theme: 'grid',
                headStyles: { fillColor: [0, 86, 60], textColor: [255, 255, 255] },
                styles: { halign: 'left' },
                columnStyles: {
                    0: { cellWidth: 100 },
                    1: { cellWidth: 60, halign: 'right' }
                }
            })
        }

        // Add refund information
        doc.setFontSize(16)
        doc.setTextColor(0, 86, 60)
        doc.text('Refund Information', 14, 210)

        // Create refund table
        autoTable(doc, {
            startY: 215,
            head: [['Description', 'Amount (PKR)']],
            body: [
                ['Total Requested', walletData.refundTracker.totalRequested.toString()],
                ['Processed', walletData.refundTracker.processed.toString()],
                ['Pending', walletData.refundTracker.pending.toString()]
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 86, 60], textColor: [255, 255, 255] },
            styles: { halign: 'left' },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 60, halign: 'right' }
            }
        })

        // Add recent transactions table on a new page
        doc.addPage()

        doc.setFontSize(16)
        doc.setTextColor(0, 86, 60)
        doc.text('Recent Transactions', 105, 20, { align: 'center' })

        // Format transactions for table
        const transactions = walletData.transactions.slice(-15).map(transaction => [
            `#${transaction.rideId.slice(-5)}`,
            `${new Date(transaction.date).getDate()}/${new Date(transaction.date).getMonth() + 1}/${new Date(transaction.date).getFullYear()}`,
            transaction.type,
            `${transaction.type === 'Send' ? '-' : '+'}${transaction.amount}`
        ])

        // Create table with transactions
        autoTable(doc, {
            startY: 30,
            head: [['Ride ID', 'Date', 'Type', 'Amount (PKR)']],
            body: transactions.length > 0 ? transactions : [['No recent transactions', '', '', '']],
            theme: 'striped',
            headStyles: { fillColor: [0, 86, 60], textColor: [255, 255, 255] },
            styles: { halign: 'left' },
            columnStyles: {
                3: { halign: 'right' }
            }
        })

        // Add footer
        const pageCount = (doc as any).internal.getNumberOfPages()
        doc.setFontSize(10)
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setTextColor(128, 128, 128)
            doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 15, { align: 'center' })
            doc.text('VeloRide - Your Trusted Ride Sharing Platform', 105, doc.internal.pageSize.height - 10, { align: 'center' })
        }

        // Save the PDF
        doc.save(`VeloRide_Wallet_Statement_${formattedDate.replace(/,/g, '').replace(/ /g, '_')}.pdf`)
    }

    return (
        <button
            onClick={generateInvoice}
            className='flex hover:bg-[#00563ccc] cursor-pointer transition-all duration-300 py-2.5 px-[0.90rem] bg-[#00563c] rounded-md text-[#fefefe] items-center gap-1 text-sm md:text-base'
        >
            <DownloadCloud size={20} /> Export
        </button>
    )
}

export default InvoiceGenerator