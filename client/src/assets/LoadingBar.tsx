export default function LoadingBar({loading}: {loading: boolean}){
    return(
        loading? (<h1 style={{textAlign:"center"}}>Loading</h1>) : (<p></p>)
    )
}