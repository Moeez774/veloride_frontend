export const url = process.env.NEXT_PUBLIC_API_URL

export const fetchWalletDetails = async ({ id }: { id: string }) => {
    try {
        const response = await fetch(`${url}/wallets/get-wallet-details?id=${id}`, {
            method: 'GET',
        })
        const data = await response.json()
        return data.data
    } catch (err) {
        return err
    }
}