import { SignInButton } from "@clerk/nextjs"
import { LuChevronRight } from "react-icons/lu"

const GettingStarted = () => {
  return (
    <div className="flex text-[#dedcdc] flex-col items-start justify-start -mt-5 h-full w-full">
        <h3 className="font-bold text-3xl">Getting Started
        <hr className="mt-2 mb-4" />
        </h3>
        <p>Welcome to Gitdocs.ai! Simplify and upgrade your README files effortlessly using AI.</p>

        <div className=" mt-2 py-4 w-4/5">
          <ul>
            <li className="mb-4 bg-[#151414] py-6 px-8 rounded-lg">
              <p className="font-semibold text-2xl">
                <span className="text-[#F8C75D] text-lg me-1">#1</span> Create an account
              </p>
              <p className="my-3 ms-8">
              Sign up now to get started, explore powerful features, and elevate your repositories!
              </p>
              <SignInButton >
                <button className="border-[#F8C75D] group ms-8 border text-[#F8C75D] hover:bg-[#e5b95b] hover:text-black transition-all duration-150 mt-5 pe-4 ps-5 py-2 rounded-lg flex items-center justify-center">
                  Sign in to gitdocs.ai

                  <LuChevronRight className="ms-1 group-hover:translate-x-1 transition-all duration-150" />
                </button>
              </SignInButton>
            </li>


            <li className="mb-4 bg-[#151414] py-6 px-8 rounded-lg">
              <p className="font-semibold text-xl">
                <span className="text-[#F8C75D] text-lg me-1">#2</span> Connect your Repository
              </p>
              <p className="ms-8 my-3">
              Choose the repository you want to enhance. Seamlessly integrate it with Gitdocs.ai to unlock AI-powered documentation capabilities.
              </p>
            </li>

            <li className="mb-4 bg-[#151414] py-6 px-8 rounded-lg">
              <p className="font-semibold text-xl">
                <span className="text-[#F8C75D] text-lg me-1">#3</span> Generate your README
              </p>
              <p className="ms-8 my-3">
              Allow our AI to analyze your codebase and generate a professional, well-structured README tailored to your project's needs.
              </p>
            </li>
          </ul>
        </div>

    </div>


  )
}
export default GettingStarted