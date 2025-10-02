import { useState } from 'react'
const Contador = () => {
    const [valor, setValor] = useState(0); // Criando um estado
    const [passo, setPasso] = useState(1);
    const diminuir = () => {
        setValor( valor - passo );
    }
    const incrementar = () => {
        setValor( valor + passo );
    }
    return (
        <div>
            {/* Input para o usuário definir o passo */}
            <div>
                <label>Passo: </label>
                <input type="number" value={passo} onChange={e => setPasso(Number(e.target.value))}/>
            </div>
            <div>
                <button onClick={diminuir}>-</button>
                <span>{valor}</span>
                <button onClick={incrementar}>+</button>
            </div>
        </div>
    )
}
export default Contador