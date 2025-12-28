npm run build
npm run dev


Abre tu navegador en http://localhost:3000 para ver la aplicación en acción.


git init

git remote add origin https://github.com/RosaTorres44/agility_champ.git

git add .
git commit -m "Primera versión del proyecto"

git branch -M version1
git pull origin reinicio
git push origin reinicio


python3 -m venv venv
source venv/bin/activate
pip freeze
pip3 install -r agility-champs/requirements.txt  --break-system-packages
