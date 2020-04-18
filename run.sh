for i in {3000..3003}
do
  xterm -e "PORT=$i node index.js" &
done