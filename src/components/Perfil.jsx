import { useState } from 'react'

const CampoEdicao = ({ label, valor, onChange, onSave }) => {
    return (
        <div>
            <label>{label}: </label>
            <input value={valor} onChange={onChange} />
            <button onClick={onSave}>Salvar</button>
        </div>
    );
}

const Perfil = ({ nome: nomeInicial, bio: bioInicial }) => {
    const imgUrl = "https://www.freeiconspng.com/uploads/profile-icon-9.png";

    const [nome, setNome] = useState(nomeInicial);
    const [bio, setBio] = useState(bioInicial);

    const [tempNome, setTempNome] = useState(nomeInicial);
    const [tempBio, setTempBio] = useState(bioInicial);

    return (
        <div>
            <h1>{nome}</h1>
            <img src={imgUrl} width={100} />
            <p>{bio}</p>

            <hr />
            <h4>Editar Perfil</h4>
            <CampoEdicao
                label="Nome"
                valor={tempNome}
                onChange={(e) => setTempNome(e.target.value)}
                onSave={() => setNome(tempNome)}
            />
            <CampoEdicao
                label="Bio"
                valor={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                onSave={() => setBio(tempBio)}
            />
        </div>
    )
}
export default Perfil