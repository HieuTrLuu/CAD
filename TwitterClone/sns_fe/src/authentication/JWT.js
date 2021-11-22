import bcrypt from 'bcrypt'; 
import JWT from 'jsonwebtoken';
let User;
let JWT_SECRET;
function login(root, { email, password }, context){
    return User.findAll({ where: { email }, raw: true }).then(async (users) => {
        if (users.length = 1) {
            const user = users[0]; const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) { throw new Error('Password	does not match'); }
            const token = JWT.sign({ email, id: user.id }, JWT_SECRET, { expiresIn: '1d' });
            return { token };
        } else { throw new Error("User not found"); }
    });
}

// We	can	go	on	and	send	the	token	with	every	request	inside the	HTTP	authorization	header. => how to do this tho ?
// => how to include JWT in headers
// => how to include JWT tokens in axios requests https://stackoverflow.com/questions/52292441/how-should-i-send-jwt-token-in-axios-get-request
// However using JWT then we can not use server rendering (Hence the other approach is using cookies)

// We	can	then	get	the	authentication	running	for all	the	other	GraphQL	queries	or	mutations	that	we	have	implemented	so	far.	

//How to generate JWT_SECRET from the environment tho ??? You	can	use	any	password	generator	by setting	the	character	count	to	128	and	excluding	any	special	characters.	Setting the	environment	variable	allows	us	to	read	the	secret	in	our	application.	You have	to	replace	it	when	going	to	production.
