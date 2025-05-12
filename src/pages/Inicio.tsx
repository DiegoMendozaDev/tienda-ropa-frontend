import NavScroll from "../components/NavScroll.tsx";
import Carrusel from "../components/Carrusel.tsx";
function Inicio(){
    return (
        <div style={{ paddingTop: '100px' }}>
            <NavScroll />
            <Carrusel/>
            <h1>INICIO</h1>
        </div>
    );
}
export default Inicio;