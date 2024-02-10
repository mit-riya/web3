import logo from "./../public/trustfolio1.svg"
const Logo =()=>{
    return (
        < div style={{width:'100px', height:'100px', position:'absolute', top:'0', right:'0', margin:'12px'}}>
            <img src={logo.src} />
        </div>
    )
}

export default Logo;