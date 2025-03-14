cd agility-champs/

npm install  --force
npm install mysql2  --force
npm install axios  --force
npm install next react react-dom  --force
npm install lucide-react
npm install clsx


npm install -g @railway/cli
railway login --browserless
railway link
railway connect

SOURCE /Users/rosa/Proyectos/agilityweb/data/scripts/datatest.sql


Si tu proyecto usa Next.js, puedes ejecutarlo con:

npm run build
npm run dev


Abre tu navegador en http://localhost:3000 para ver la aplicación en acción.


git init

git remote add origin https://github.com/RosaTorres44/agility.git

git add .
git commit -m "Primera versión del proyecto"

git branch -M version1
git pull origin version1
git push origin version1


python3 -m venv venv
source venv/bin/activate
pip freeze
pip3 install -r agility-champs/requirements.txt  --break-system-packages
