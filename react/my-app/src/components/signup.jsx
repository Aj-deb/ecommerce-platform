const Signup = ()=>{
     <form onSubmit={handleSubmit}>
                        <div className="text-md font-medium text-gray-600 mt-8 m-14">
                            <p >Name</p>
                            <Fields type="name" onChange={(e) => setName(e.target.value)} name="name" placeholder="Enter the Name" />

                            <p className="mt-4">Email</p>
                            <Fields type="email" onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Enter the email" />
                            {errors.email}

                            <p className="mt-4">Password</p>
                            <Fields onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter the password" />
                            <p>{errors.password}</p>

                            <p className="mt-4">Confirm Password</p>
                            <Fields onChange={(e) => setConfirmPassword(e.target.value)} name="password" placeholder="Confirm the password" />
                            <p className="mt-1 text-red-400">{errors.Matched}</p>

                            <pre>{errors.general}</pre>
                            
                            <Button onClick={next} className={"w-full"} name="Login" disabled={loading} type="submit" >
                                {loading ? "Continue...":"Continue"}
                            </Button>

                            {/* <Fields onChange={(e) => e.target.value}  placeholder="Enter the email" /> */}
                            {/* <Button type="button" onClick={()=>{sendOtpRequest.mutate({email})}}>Send Otp</Button>   */}
                            <p className="text-sm font-semibold mt-4 flex justify-center">Already a user ?{<Link to="/" className="text-blue-500 px-1">Login</Link>}</p>
                        </div>
    </form>
}    
export default Signup