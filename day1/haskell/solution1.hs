import Control.Monad.Cont (cont)
import Data.Char (isDigit)
import Distribution.Compat.Prelude (readMaybe)

findDigits inputString = outputString
  where
    b = take 1 (filter isDigit inputString)
    c = take 1 (reverse (filter isDigit inputString))
    outputString = b ++ c

choose :: Maybe Int -> Int
choose (Just i) = i
choose Nothing = 0

toNumber input = choose (readMaybe input :: Maybe Int)

calibration i = toNumber (findDigits i)

main =
  do
    contents <- readFile "../input"
    print (sum (map calibration (lines contents)))
