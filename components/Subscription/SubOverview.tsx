import UsageSummary from "./UsageSummary";
import DataDashboard from "./DataDashboard";

const SubOverview = () => {
  const stats = {
    tokens: 2548,
    totalTokens: 10000,
    repositories: 2,
    maxRepositories: 3,
  };
  return (
    <div>
    <h1 className="text-lg font-semibold">Overview</h1>
    <p className="text-sm mt-1 text-[#999]">View your subscription and billing information.</p>
    <UsageSummary stats={stats} />
    <DataDashboard stats={stats} />
</div>
  )
}
export default SubOverview