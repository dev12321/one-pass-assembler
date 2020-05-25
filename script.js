let state = {
  inputCode: "",
  opTab: "",
  output: "",
  symTab: "",
  symTab1: "",
  result: "",
  isSubmitted: false,
  showMore: false,
};

const handleLoad = () => {
  document.getElementById("inputCode").value = `COPY	START	1000
-	LDA	ALPHA
-	STA	BETA
ALPHA	RESW	1
BETA	RESW	1
-	END	-`;

  document.getElementById("opTab").value = `LDA	00
STA	23
LDCH	15
STCH	18`;
};

const handleSubmit = () => {
  let lc,
    sa,
    i = 0,
    j = 0,
    m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    pgmlen,
    len,
    k,
    len1,
    l = 0,
    name = "",
    s1 = "*",
    s2 = "",
    q = "",
    s3 = "",
    inputCodeTemp = document.getElementById("inputCode").value,
    opTabTemp = document.getElementById("opTab").value,
    outputTemp = "",
    symTabTemp = "",
    symTab1Temp = "",
    resultTemp = "";

  inputCodeTemp
    .split("\n")
    .map((el) => el.split("\t"))
    .forEach((inputCodeLine) => {
      let [la, mne, opnd] = inputCodeLine;
      if (mne === "START") {
        sa = parseInt(opnd);
        name = la.slice();
        lc = sa;
        return;
      }
      if (mne !== "END") {
        if (la === "-") {
          let opTabFound = opTabTemp
            .split("\n")
            .map((el) => el.split("\t"))
            .find((opTabLine) => opTabLine[0] === mne);
          if (opTabFound) {
            let [mne1, opnd1] = opTabFound;
            m[i] = lc + 1;
            symTabTemp = `${symTabTemp}${opnd}\t${s1}\n`;
            outputTemp = `${outputTemp}${opnd1}\t0000\n`;
            lc = lc + 3;
            i = i + 1;
          }
        } else {
          let symTabFound = symTabTemp
            .split("\n")
            .map((el) => el.split("\t"))
            .find((symTabLine) => symTabLine[0] === la);
          if (symTabFound) {
            symTab1Temp = `${symTab1Temp}${la}\t${lc}\n`;
            outputTemp = `${outputTemp}${m[j]}\t${lc}\n`;
            j = j + 1;
            i = i + 1;
          }
          if (mne === "RESW") lc = lc + 3 * parseInt(opnd);
          else if (mne === "BYTE") {
            s2 = "-";
            len = opnd.length;
            lc = lc + len - 2;
            q = opnd.slice(2);
            for (k = 2; k < len; k++) {
              q[l] = opnd[k];
              l = l + 1;
            }
            outputTemp = `${outputTemp}${q}\t${s2}\n`;
            // break;
          } else if (mne === "RESB") lc = lc + parseInt(opnd);
          else if (mne === "WORD") {
            s3 = "#";
            lc = lc + 3;
            outputTemp = `${outputTemp}${opnd}\t${s3}\n`;
            // break;
          }
        }
      }
    });

  pgmlen = lc - sa;
  resultTemp = `${resultTemp}H^${name}^${sa}^0${pgmlen.toString(16)}\n`;
  resultTemp = `${resultTemp}T^00${sa}^0${pgmlen.toString(16)}`;
  outputTemp
    .trim()
    .split("\n")
    .map((el) => el.split("\t"))
    .forEach((outputLine) => {
      let [obj1, obj2] = outputLine;
      if (obj2 === "0000") resultTemp = `${resultTemp}^${obj1}${obj2}`;
      else if (obj2 === "-") {
        resultTemp = `${resultTemp}^`;
        len1 = obj1.length;
        for (k = 0; k < len1; k++) resultTemp = `${resultTemp}${obj1[k]}`;
      } else if (obj2 === "#") {
        resultTemp = `${resultTemp}^`;
        resultTemp = `${resultTemp}${obj1}`;
      }
    });
  outputTemp
    .trim()
    .split("\n")
    .map((el) => el.split("\t"))
    .forEach((outputLine) => {
      let [obj1, obj2] = outputLine;
      if (obj2 !== "0000") {
        if (obj2 !== "-") {
          if (obj2 !== "#") {
            resultTemp = `${resultTemp}\n`;
            resultTemp = `${resultTemp}T^${obj1}^02^${obj2}`;
          }
        }
      }
    });

  resultTemp = `${resultTemp}\nE^00${sa}`;

  document.getElementById("output").value = outputTemp;
  document.getElementById("symTab").value = symTabTemp;
  document.getElementById("symTab1").value = symTab1Temp;
  document.getElementById("result").value = resultTemp;
  document.getElementById("result-section").classList.remove("hidden");
};

const handleShowMore = () => {
  document.getElementById("show-more").classList.toggle("hidden");
};
