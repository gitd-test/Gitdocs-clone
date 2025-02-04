const currDate = new Date();

export default function updatedAgo(lastUpdated: Date) {
    const lastUpdatedDate = new Date(lastUpdated);
    const diffTime = Math.abs(currDate.getTime() - lastUpdatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}